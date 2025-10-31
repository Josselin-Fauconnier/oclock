function tick() {
  
  const now = new Date();
  const hours = now.getHours() % 12;          
  const minutes = now.getMinutes();           
  const secondes = now.getSeconds();          

  
  const hourDeg = (hours * 30) + (minutes * 0.5);  

  
  const minutesDeg = (minutes * 6) + (secondes * 0.1);

  
  document.getElementById('hand-hour').style.transform =
    `translate(-50%, 0) rotate(${hourDeg}deg)`;

  document.getElementById('hand-minute').style.transform =
    `translate(-50%, 0) rotate(${minutesDeg}deg)`;
}


tick();


setInterval(tick, 100);