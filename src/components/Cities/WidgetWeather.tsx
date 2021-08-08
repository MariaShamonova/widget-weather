import React, {useState, useEffect, FunctionComponent} from 'react'
import gear from './images/gear.png'
import CitiesItem from './CitiesItem'
import ModalSetting from './Modal/ModalSetting'
import {WeatherDataType} from './CitiesItem'

export interface SelectedListType{
    id: number
    order: number
    name: string
}

type AppProps= {
    currWeather: WeatherDataType[]
}

const WidgetWeather: FunctionComponent<AppProps> = ({
	currWeather
}) => {

    const insertIf = (condition: boolean, ...elements: SelectedListType[]) => {
		return condition ? elements : []
	}
   
    const apiKey = 'bdf8194cb2aa74ffc6a004548c775541'

    const [data, setData] = useState(currWeather);
    const [open, setOpen] = useState(false)
	const closeModal = () => setOpen(false)
    const [selectedList, setSelectedList] = useState<SelectedListType[]>(
        [
            ...insertIf(
                currWeather.length > 0, 
                {
                    id: 0,
                    order: 0,
                    name: currWeather.length > 0 ? currWeather[0].name : ''
                }),
            
        ]
    )

   const clickSave = async (listCities: SelectedListType[]) => {

        const cities = await Promise.all(
            listCities.map(async (city: SelectedListType) => {
                return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`)
                    .then(res => {
                        if (res.ok) {                     
                            return res.json()
                        }
                        return res.text().then(text => {
                            console.log(text)
                            throw new Error(text)
                        })
                    })
                })
        );
        setData([...cities])
   }

   const MainComponent = () => {
        return (
            <div className="widget-weather__main">
                {
                    data.length > 0 ? data.map((el, index) => (
                        <CitiesItem data={el} key={index}/>
                    )) : 
                    <div className="message__empty">No selected cities</div>
                }
            </div>
        )
    }

	return (
		<div className="widget-weather">
            <div className="widget-weather__wrapper">
                <div className="widget-weather__header">
                    <div className="title">Weather</div>
                    <div className="icon" onClick={() => setOpen((open) => !open)}>
                        <img src={gear} alt="" />
                    </div>
                    <ModalSetting 
                        open={open} 
                        closeModal={closeModal} 
                        clickSave={clickSave}
                        selectedList={selectedList}
                    />
                </div>
                <MainComponent />
            </div>				
		</div>
	)
}

export default WidgetWeather
