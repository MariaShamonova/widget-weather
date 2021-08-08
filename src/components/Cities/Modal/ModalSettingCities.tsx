import React, {
    useState,
    DragEvent ,
	FunctionComponent,
} from 'react'

import humb from '../images/humb.png'
import removeImg from '../images/remove.png'
import {SelectedListType} from '../WidgetWeather'

type AppProps = {
    city: SelectedListType
    key: number
    removeItem: (id: number) => void
    dropHandler: (e:  DragEvent<HTMLDivElement>, city: SelectedListType) => void
    setCurrentCard: (city: SelectedListType ) => void
}

const ModalSettingCities: FunctionComponent<AppProps> = ({
	city,
    removeItem,
    dropHandler,
    setCurrentCard
}) => {

    const dragStartHandler = () => {  
        setCurrentCard(city)
    }
    const dragLeaveHandler = (e:  DragEvent<HTMLDivElement>) => {
        e.target.style.background = '#E2E1E1'
    }

    const dragEndHandler = (e:  DragEvent<HTMLDivElement>) => { 
        e.target.style.background = '#E2E1E1'
    }
    const dragOverHandler = (e:  DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.target.style.background = '#7D7D7D'
    }

    return(
		<div 
            className="modal-setting-cities" 
            draggable={true}
            onDragStart={dragStartHandler}
            onDragLeave={ dragLeaveHandler}
            onDragEnd={dragEndHandler}
            onDragOver={dragOverHandler}
            onDrop={(e: DragEvent<HTMLDivElement>)=> { 
                dropHandler(e, city)
                e.target.style.background = '#E2E1E1'
            }}
        >
            <div className="modal-setting-cities__humb">
                <img src={humb} alt="" />
            </div>
            <div className="modal-setting-cities__title">{city.name}</div>
            <div className="modal-setting-cities__remove" onClick={() => removeItem(city.id)}>
                <img src={removeImg} alt="" />
            </div>
        </div>
	)
}
export default ModalSettingCities
