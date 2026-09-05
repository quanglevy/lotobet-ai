export const generateMockData = (count = 1000) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);

  // Seeded PRNG so history is identical across all devices
  let seed = 1234567;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 1; i <= count; i++) {
    const drawDate = new Date(startDate);
    drawDate.setDate(drawDate.getDate() + i);
    
    // Generate 5 digits (0-9)
    let resultStr = '';
    for (let j = 0; j < 5; j++) {
      resultStr += Math.floor(random() * 10).toString();
    }

    data.push({
      Draw_ID: `260821${(1000 + i).toString()}`,
      Draw_Date: drawDate.toISOString().split('T')[0],
      Draw_Time: "18:00:00",
      Result: resultStr,
      Source: "Mock Generator",
      Update_Time: new Date().toISOString()
    });
  }
  
  return data.reverse();
};
