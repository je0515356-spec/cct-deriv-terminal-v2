export type Market = {symbol:string;display_name:string;market_display_name?:string;submarket_display_name?:string;exchange_is_open?:number};
export type Candle = {time:number;open:number;high:number;low:number;close:number};
const appId = import.meta.env.VITE_DERIV_APP_ID || '1089';
const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${encodeURIComponent(appId)}`;
type Pending = {resolve:(v:any)=>void;reject:(e:Error)=>void;timeout:ReturnType<typeof setTimeout>};
export class DerivFeed {
  private ws:WebSocket|null=null;
  private pending=new Map<number,Pending>();
  private reqId=1;
  private subs=new Set<string>();
  private listeners=new Set<(m:any)=>void>();
  private statusListeners=new Set<(s:string)=>void>();
  private pingTimer:ReturnType<typeof setInterval>|null=null;
  private reconnectTimer:ReturnType<typeof setTimeout>|null=null;
  private stopped=false;
  private reconnectCount=0;
  onMessage(cb:(m:any)=>void){this.listeners.add(cb);return ()=>this.listeners.delete(cb)}
  onStatus(cb:(s:string)=>void){this.statusListeners.add(cb);return ()=>this.statusListeners.delete(cb)}
  private status(s:string){this.statusListeners.forEach(cb=>cb(s))}
  connect(){
    this.stopped=false;
    if(this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING))return;
    this.status('Connexion…');
    const ws=new WebSocket(endpoint);this.ws=ws;
    ws.onopen=()=>{this.reconnectCount=0;this.status('Connecté');this.pingTimer=setInterval(()=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({ping:1}))},30000)};
    ws.onmessage=(e)=>{let m:any;try{m=JSON.parse(e.data)}catch{return}
      if(m.req_id && this.pending.has(m.req_id)){const p=this.pending.get(m.req_id)!;clearTimeout(p.timeout);this.pending.delete(m.req_id);m.error?p.reject(new Error(m.error.message)):p.resolve(m)}
      if(m.subscription?.id)this.subs.add(m.subscription.id);
      this.listeners.forEach(cb=>cb(m));
    };
    ws.onerror=()=>this.status('Erreur réseau');
    ws.onclose=()=>{if(this.ws!==ws)return;this.status('Déconnecté');if(this.pingTimer)clearInterval(this.pingTimer);this.pending.forEach(p=>{clearTimeout(p.timeout);p.reject(new Error('Connexion interrompue'))});this.pending.clear();this.subs.clear();this.ws=null;if(!this.stopped){const delay=Math.min(30000,1000*2**Math.min(this.reconnectCount++,5));this.reconnectTimer=setTimeout(()=>this.connect(),delay)}};
  }
  async ready(){if(this.ws?.readyState===WebSocket.OPEN)return;this.connect();await new Promise<void>((resolve,reject)=>{const started=Date.now();const timer=setInterval(()=>{if(this.ws?.readyState===WebSocket.OPEN){clearInterval(timer);resolve()}else if(Date.now()-started>12000){clearInterval(timer);reject(new Error('Délai de connexion dépassé'))}},100)})}
  async request<T=any>(payload:Record<string,unknown>):Promise<T>{await this.ready();const id=this.reqId++;return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{this.pending.delete(id);reject(new Error('Réponse API trop lente'))},15000);this.pending.set(id,{resolve,reject,timeout});this.ws!.send(JSON.stringify({...payload,req_id:id}))})}
  async markets():Promise<Market[]>{const r=await this.request<{active_symbols:Market[]}>({active_symbols:'brief',product_type:'basic'});return r.active_symbols.filter(m=>m.symbol && m.display_name).sort((a,b)=>a.display_name.localeCompare(b.display_name))}
  async candles(symbol:string,granularity:number,count=500):Promise<Candle[]>{const r=await this.request<{candles?:Array<{epoch:number;open:string|number;high:string|number;low:string|number;close:string|number}>}>({ticks_history:symbol,style:'candles',granularity,count,end:'latest'});return (r.candles||[]).map(c=>({time:c.epoch,open:Number(c.open),high:Number(c.high),low:Number(c.low),close:Number(c.close)})).filter(c=>[c.open,c.high,c.low,c.close].every(Number.isFinite)).sort((a,b)=>a.time-b.time)}
  async subscribe(symbol:string,granularity:number){const r=await this.request<{subscription?:{id:string}}>({ticks_history:symbol,style:'candles',granularity,count:1,end:'latest',subscribe:1});return r.subscription?.id}
  async forget(id:string){try{await this.request({forget:id})}catch{/* connection may be closed */}this.subs.delete(id)}
  stop(){this.stopped=true;if(this.reconnectTimer)clearTimeout(this.reconnectTimer);if(this.pingTimer)clearInterval(this.pingTimer);this.ws?.close();this.ws=null}
}
