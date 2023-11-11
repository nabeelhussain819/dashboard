export const data = {
    labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#1677ff',
        data: [
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt(),
            getRandomInt()
          ]
      }
    ]
  }
  
  function getRandomInt() {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }
  
  export const options = {
    responsive: true,
    maintainAspectRatio: false
  }
  