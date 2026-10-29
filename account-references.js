(() => {
  let client = null;
  let ownerId = null;
  let rows = [];
  const fields = 'id,reference_id,title,url,description,institution,field,created_at';

  function getClient() {
    const config=window.STC_SUPABASE||{};
    if(!window.supabase||!config.url||!config.anonKey)throw new Error('Supabase is not configured');
    return client||(client=window.supabase.createClient(config.url,config.anonKey));
  }
  async function getOwner() {
    const {data,error}=await getClient().auth.getSession();
    if(error)throw error;
    if(!data.session?.user?.id)throw new Error('Sign in to sync saved references');
    return data.session.user.id;
  }
  async function load() {
    const db=getClient(),userId=await getOwner();
    if(ownerId!==userId){ownerId=userId;rows=[]}
    const {data,error}=await db.from('user_saved_references').select(fields).eq('user_id',userId).order('created_at',{ascending:false});
    if(error)throw error;
    rows=data||[];
    const legacyKey='stcSavedReferences',migrationKey=`stcSavedReferencesMigrated:${userId}`;
    if(localStorage.getItem(legacyKey)&&!localStorage.getItem(migrationKey)){
      let legacy=[];try{legacy=JSON.parse(localStorage.getItem(legacyKey)||'[]')}catch{}
      const urls=new Set(rows.map(item=>String(item.url).toLowerCase().replace(/\/$/,'')));
      const pending=legacy.filter(item=>item?.title&&item?.url&&!urls.has(String(item.url).toLowerCase().replace(/\/$/,''))).map(item=>({user_id:userId,reference_id:item.reference_id||null,title:String(item.title).slice(0,180),url:item.url,description:item.description||'',institution:item.institution||'',field:item.field||''}));
      if(pending.length){const{error:migrationError}=await db.from('user_saved_references').insert(pending);if(migrationError)throw migrationError}
      localStorage.setItem(migrationKey,'true');localStorage.removeItem(legacyKey);
      if(pending.length){const refreshed=await db.from('user_saved_references').select(fields).eq('user_id',userId).order('created_at',{ascending:false});if(refreshed.error)throw refreshed.error;rows=refreshed.data||[]}
    }
    return rows.slice();
  }
  async function save(item) {
    const db=getClient(),userId=await getOwner(),key=String(item.url||'').toLowerCase().replace(/\/$/,'');
    if(ownerId!==userId)await load();
    const existing=rows.find(entry=>String(entry.url).toLowerCase().replace(/\/$/,'')===key);
    if(existing)return {row:existing,alreadySaved:true};
    const payload={user_id:userId,reference_id:item.id||item.reference_id||null,title:String(item.title||'').slice(0,180),url:item.url,description:item.description||'',institution:item.institution||'',field:item.field||''};
    const{data,error}=await db.from('user_saved_references').insert(payload).select(fields).single();
    if(error)throw error;
    rows.unshift(data);return {row:data,alreadySaved:false};
  }
  async function remove(id) {
    const db=getClient(),userId=await getOwner();
    const{error}=await db.from('user_saved_references').delete().eq('id',id).eq('user_id',userId);
    if(error)throw error;
    rows=rows.filter(item=>item.id!==id);return rows.slice();
  }
  window.STC_ACCOUNT_REFERENCES={load,save,remove,isSaved:url=>rows.some(item=>String(item.url).toLowerCase().replace(/\/$/,'')===String(url||'').toLowerCase().replace(/\/$/,'')),getRows:()=>rows.slice()};
})();
