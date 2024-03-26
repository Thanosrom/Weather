import { useState,useEffect } from 'react'
//CSS Imports
import '../CSS/Home.css'
//Components
import WeatherCard from '../Components/Cards';
import CustomModal from '../Components/Modal';
//Chart Libs
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale,LinearScale,PointElement, Tooltip } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels,LineElement, CategoryScale,LinearScale,PointElement,Tooltip );

function Home() {

  //Setting Data
  const [data, setData] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Now');
  const [selectedDate, setSelectedDate] =  useState(new Date()); 
  const [showModal, setShowModal] = useState(false);
  const [selectedDateWeather, setSelectedDateWeather] = useState(null); 

  //Rest API call 
  useEffect(() => {
    const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=40.58725980318928&lon=22.948223362612612&exclude=hourly,minutely&appid=11b0499bd13ab56063de7565a440eb97&units=metric&dt=${unixTimestamp}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    
  }, [selectedDate]);

  //Set Selected Date
  useEffect(() => {
    if (data) {
      const currentDateWeather = data.daily.find((day) => {
        const date = new Date(day.dt * 1000); 
        return date.toDateString() === selectedDate.toDateString();
      });

      if (currentDateWeather) {
        setSelectedDateWeather(currentDateWeather);
      } else {
        setSelectedDateWeather(null); 
      }
    }
  }, [data, selectedDate]);

  //Get icon PNG
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  //Handle Button
  const handleButtonClick = (button) => {
    setSelectedButton(button);
    
    if (button === 'SelectDate') {
      setShowModal(true);
    }

  };

  //Handle Selecting Date
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowModal(false);
  };

  //Chart FontSizes
  const chartFontSize = () => {
    if (window.innerWidth < 550) {
      return 12; 
    } else if (window.innerWidth >= 550 && window.innerWidth < 800) {
      return 16; 
    } else {
      return 20;
    }
  };

  return (
    <>
      {/* Home Container */}
      <div className='HomeDiv'>

        {showModal && (
          <CustomModal onClose={() => setShowModal(false)} onSelectDate={handleDateSelect}>
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>
          </CustomModal>
        )}

        {/* Button Container */}
        <div className='ButtonsDivs'>
          <button className='smallButtons' onClick={() => handleButtonClick('Now')}>Now</button>
          <button className='smallButtons' onClick={() => handleButtonClick('Today')}>Today</button>
          <button className='smallButtons' onClick={() => handleButtonClick('SelectDate')}>Select Date</button>
        </div>


        {/* Weather Forecast Container */}
        {data ? (
          <div className='weatherDiv'>
            <div className='weatherInternalDiv_1'>
              <p className='weatherTemperature_P1'>{
                selectedButton === 'Now' ? data.current.temp.toFixed(0)
                : selectedButton === 'Today' ? ((data.daily[0].temp.morn + data.daily[0].temp.night)/2).toFixed(0) 
                : ((selectedDateWeather.temp.morn + selectedDateWeather.temp.night) /2).toFixed(0)}°C
              </p>
              <p className='weatherDescription_P1'>{
                selectedButton === 'Now' ? `${data.current.weather[0].main} - ${data.current.weather[0].description}` 
                : selectedButton === 'Today' ? `${data.daily[0].weather[0].main} - ${data.daily[0].weather[0].description}` 
                : `${selectedDateWeather.weather[0].main} - ${selectedDateWeather.weather[0].description}` 
              }
              </p>
            </div>
            <div className='weatherInternalDiv_2'>
              {selectedButton === 'Now' ? (
                <img
                  style={{ width: '10rem', height: '10rem' }}
                  src={getWeatherIconUrl(data.current.weather[0].icon)}
                  alt= {'Error Showing the Image'}
                />
                ) :selectedButton === 'Today' ?  (
                <img
                  style={{ width: '10rem', height: '10rem' }}
                  src={getWeatherIconUrl(data.daily[0].weather[0].icon)}
                  alt= {'Error Showing the Image'}
                />
                ) : 
                <img
                  style={{ width: '10rem', height: '10rem' }}
                  src={getWeatherIconUrl(data.daily[0].weather[0].icon)}
                  alt= {'Error Showing the Image'}
                />
              }
            </div>
          </div>
          ) : (
            <p>Loading...</p>
          )
        }

    
        {/* Small Line */}
        <div className='LineSmall'></div>


        {/* Cards Container*/}
        {data ? (
          <div className='AllCards'>
            <div className='divCards_1'>
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.feels_like.day : data.daily[0].feels_like.day)} 
                description={'Feels like'}
                unit={'°C'}
              />
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.wind_speed : data.daily[0].wind_speed)} 
                description={'Wind'} 
                unit={'m/s'}
              />
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.wind_gust : data.daily[0].wind_gust)} 
                description={'Wind Gust'} 
                unit={'m/s'}
              />
            </div>
            <div className='divCards_2'>
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.wind_deg : data.daily[0].wind_deg)} 
                description={'Wind Deg'} 
                unit={'°'}
              />
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.humidity : data.daily[0].humidity)} 
                description={'Humidity'} 
                unit={'%'}
              />
              <WeatherCard 
                temperature={JSON.stringify(selectedButton === 'SelectDate' ? selectedDateWeather.pressure : data.daily[0].pressure)} 
                description={'Pressure'}
                unit={'hPa'}
              />
            </div>
          </div>
          ) : (
            <p>Loading...</p>
          )
        }

        {/* Big Line */}
        <div className='LineBigger'></div>
        
        {/* Chart Details */}
        <div className='ChartTitles_Div'>
          <h2>Weekly Variation</h2>
          <h4>Temperature</h4>
        </div>

        {/* Chart */}
        {data && data.current && (             
          <div className='LineChart'>
            <Line
              data={{
                labels: data.daily.slice(0, 7).map(day => {
                  const date = new Date(day.dt * 1000);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }),                  
                datasets: [{
                  data: data.daily.slice(0, 7).map(day => day.temp.day),
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: '#91C345',
                  pointRadius: 0,
                  pointHoverRadius: 0 ,
                  pointLabel:  data.daily.slice(0, 7).map(day => day.temp.day),
                }]
              }}
              options={{
                plugins:{
                  datalabels: {
                    display: true,
                    align: 'top',
                    font: {
                      size:chartFontSize(),
                      color:'black',
                    },
                    formatter: function(value, context) {
                      return value + '°C'; 
                    },
                    labels: {
                      value: {
                        color: 'black'
                      }
                    }
                  },
                  legend: {
                    display: true
                  },
                  tooltip: {
                    enabled:true,
                    mode:'nearest',
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    type: 'category',
                    grid:{
                      display:true,
                    },
                    beginAtZero: true,
                    ticks:{
                      font: {
                        size:chartFontSize(),
                        color:'black',
                        weight: '800'
                      }
                    },
                  },
                  y:{
                    grid:{
                      display:false
                    },
                    ticks: {
                      min:0,
                      max:25,
                      stepSize:5,
                      values: [0, 5, 10, 15, 20, 25],
                      beginAtZero: true,
                      font: {
                        size:chartFontSize(),
                      }        
                    },
                    min:0,
                    max:25,
                  }
                }
              }}
            />
          </div>
          )}

      </div>

    </>
  )
}

export default Home
