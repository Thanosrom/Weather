import React from 'react';
//CSS
import '../CSS/Cards.css'

//Card Reusable Component
function WeatherCard({ temperature, description, unit  }) {
    return (
        <div className='cards'>
            <p className='weatherTemperature'>
                {temperature} 
                {unit === '°' || unit === '°C' ? (
                    <span className='unit'> {unit}</span>
                ) : (
                    <span className='smallerUnit'> {unit}</span>
                )}
            </p>            
            <p className='weatherDescription'>{description}</p>
        </div>
    );
}

export default WeatherCard;