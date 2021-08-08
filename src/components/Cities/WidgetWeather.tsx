import React, {useState, useEffect, FunctionComponent} from 'react'
import gear from './images/gear.png'
import CitiesItem from './CitiesItem'
import ModalSetting from './Modal/ModalSetting'
import preloader from './images/preloader.gif'
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
        console.log(elements)
		return condition ? elements : []
	}
   
    const apiKey = 'bdf8194cb2aa74ffc6a004548c775541'

    const [lat, setLat] = useState<number>();
    const [long, setLong] = useState<number>();
    const [selectedList, setSelectedList] = useState<SelectedListType[]>(
        [
            // {
            //     id: 0,
            //     order: 0,
            //     name: currWeather[0].name
            // },
            ...insertIf(
                currWeather.length > 0, 
                {
                    id: 0,
                    order: 0,
                    name: currWeather.length > 0 ? currWeather[0].name : ''
                }),
            
        ]
    )
    

    const loader = (
		<div 
            className="preloader__wrapper"
            style={{
                        height: '80vh', 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                }}
            >
			<img src={preloader} alt="preload" width={50} height={50} />
		</div>
	)

    const [data, setData] = useState(currWeather);
    const [open, setOpen] = useState(true)
	const closeModal = () => setOpen(false)

	const MainComponent = () => {
		return (
			<div className="widget-weather__main">
                {
                    data.map((el, index) => (
                        <CitiesItem data={el} key={index}/>
                    ))
                }
            </div>
		)
	}

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
