const fetch = require('node-fetch');
const base = process.env.BASE_URL || 'http://localhost:5000/api';

const j = (o) => JSON.stringify(o);

async function req(path, opts = {}){
  const res = await fetch(base + path, opts);
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; } catch(e) { return { ok: res.ok, status: res.status, text }; }
}

async function run(){
  console.log('Logging in admin...');
  let r = await req('/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: j({ email: 'admin@nagrik360.local', password: process.env.ADMIN_PASSWORD || 'adminpass' }) });
  if(!r.ok){ console.error('Admin login failed', r); process.exit(1); }
  const adminToken = r.data.token;
  console.log('Admin logged in.');

  console.log('Create department...');
  r = await req('/departments', { method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken}, body: j({ name: 'E2E Dept', code: 'E2E01', description: 'Created by e2e test' }) });
  let deptId;
  if(!r.ok){
    console.warn('Create dept failed, attempting to reuse existing department.');
    const all = await req('/departments', { method: 'GET', headers: {'Authorization': 'Bearer ' + adminToken} });
    if(all.ok && (all.data.departments || all.data.length)){
      const list = all.data.departments || all.data;
      deptId = list[0]._id;
      console.log('Using existing dept:', deptId);
    } else { console.error('No departments available', all); process.exit(1); }
  } else {
    deptId = r.data.department._id;
  }
  console.log('DeptId:', deptId);

  console.log('Create officer...');
  const offEmail = 'officer'+Math.floor(Math.random()*99999)+'@example.com';
  r = await req('/officers', { method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken}, body: j({ name: 'E2E Officer', email: offEmail, password: 'officerpass', phone: '9998887777', department: deptId }) });
  if(!r.ok){ console.error('Create officer failed', r); process.exit(1); }
  const officerId = r.data.officer._id;
  console.log('OfficerId:', officerId);

  console.log('Register citizen...');
  const citEmail = 'citizen'+Math.floor(Math.random()*99999)+'@example.com';
  r = await req('/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: j({ name: 'E2E Citizen', email: citEmail, password: 'citizenpass', phone: '9123456789' }) });
  if(!r.ok){ console.error('Citizen register failed', r); process.exit(1); }
  const citizenToken = r.data.token;
  console.log('CitizenId:', r.data.user._id);

  console.log('Create complaint as citizen...');
  const location = { type: 'Point', coordinates: [77.5946, 12.9716], address: 'E2E Addr', city: 'Bengaluru' };
  r = await req('/complaints', { method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + citizenToken}, body: j({ title: 'E2E Pothole', description: 'Test pothole creating via e2e script', location: JSON.stringify(location), category: 'Pothole', severity: 'high' }) });
  if(!r.ok){ console.error('Create complaint failed', r); process.exit(1); }
  const complaintId = r.data.complaint._id;
  console.log('ComplaintId:', complaintId);

  console.log('Assigning complaint to officer...');
  r = await req('/complaints/' + complaintId + '/assign', { method: 'PUT', headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken}, body: j({ departmentId: deptId, assignedTo: officerId }) });
  console.log('Assign response:', r);

  console.log('Updating status to in_progress...');
  r = await req('/complaints/' + complaintId + '/status', { method: 'PUT', headers: {'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken}, body: j({ status: 'in_progress', remark: 'E2E start' }) });
  console.log('Status update response:', r);

  console.log('E2E test completed successfully.');
}

run().catch((e)=>{ console.error('E2E error', e); process.exit(1); });
