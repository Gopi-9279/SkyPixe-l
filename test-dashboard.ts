import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@skypixel.com',
      password: 'Skypixel2026!'
    });
    
    const cookie = res.headers['set-cookie'];
    console.log('Login success');
    
    const dashRes = await axios.get('http://localhost:5000/api/admin/dashboard', {
      headers: { Cookie: cookie }
    });
    
    console.log('Dashboard Data:', dashRes.data);
    
    const albumsRes = await axios.get('http://localhost:5000/api/albums', {
      headers: { Cookie: cookie }
    });
    console.log('Albums Data count:', albumsRes.data.data.length);
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
