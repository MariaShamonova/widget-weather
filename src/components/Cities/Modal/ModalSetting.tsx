import React, { useState, useMemo, DragEvent, MouseEvent, KeyboardEvent, FunctionComponent } from "react";
import "./ModalSetting.scss";
import Popup from "reactjs-popup";
import closeImg from "../images/close.png";
import ModalSettingCities from "./ModalSettingCities";
import { SelectedListType } from "../WidgetWeather";

type AppProps = {
  open: boolean;
  closeModal: (event?: SyntheticEvent<Element, Event> | KeyboardEvent | TouchEvent | MouseEvent | undefined) => void;

  selectedList: SelectedListType[];
  clickSave: (listCities: SelectedListType[]) => void;
};

const ModalSetting: FunctionComponent<AppProps> = ({ open, closeModal, clickSave, selectedList }) => {
  const [enteredValue, setEnteredValue] = useState<string>("");
  const [selectedListCities, setSelectedListCities] = useState<SelectedListType[]>(selectedList);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentCard, setCurrentCard] = useState<SelectedListType>();

  const tempCities = selectedList;

  const changedEnterValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(e.target.value);
    if (errorMessage !== "") setErrorMessage("");
  };

  const addCityInProp = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    const value = enteredValue.replace(/\d+/g, "");
    if (value !== enteredValue) setEnteredValue(value);
    const apiKey = "bdf8194cb2aa74ffc6a004548c775541";
    const existCurrEnterCityInArray = selectedListCities
      .map(function (e) {
        return e.name.toUpperCase();
      })
      .indexOf(value.toUpperCase());

    if ((e.target as HTMLInputElement).className === "button" || (e.key === "Enter" && existCurrEnterCityInArray !== 1)) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}`).then(async (response) => {
        const statusRequest = await response.json();
        if (statusRequest.cod !== 200) {
          setErrorMessage(statusRequest.message);
          setTimeout(() => {
            setErrorMessage("");
          }, 2000);
        } else {
          setSelectedListCities([
            ...selectedListCities,
            {
              id: statusRequest.id,
              order: selectedListCities.length,
              name: value,
            },
          ]);
          setEnteredValue("");
        }
        return response;
      });
    } else if (existCurrEnterCityInArray === 1) {
      setErrorMessage("This city already exists on the list");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  const removeItemCity = (id: number) => {
    const temp = selectedListCities.filter((el: SelectedListType) => {
      return el.id !== id;
    });
    setSelectedListCities([...temp]);
  };

  const MessageError = useMemo(() => {
    return <div className="add-city__error-message">{errorMessage}</div>;
  }, [errorMessage]);

  const dropHandler = (e: DragEvent<HTMLDivElement>, card: SelectedListType) => {
    setSelectedListCities(
      selectedListCities
        .map((c) => {
          if (c.id === card.id) {
            return {
              ...c,
              order: currentCard!.order,
            };
          }
          if (c.id === currentCard!.id) {
            return {
              ...c,
              order: card.order,
            };
          }
          return c;
        })
        .sort(function (a, b) {
          return a.order > b.order ? 1 : -1;
        }),
    );
  };

  const clickCancel = () => {
    closeModal(false);
    setEnteredValue("");
    setSelectedListCities([...tempCities]);
  };

  return (
    <Popup open={open} closeOnDocumentClick onClose={closeModal} modal>
      {(close: boolean) => (
        <div className="modal-setting">
          <div className="modal-setting__header">
            <div className="title">Setting</div>
            <div className="icon" onClick={() => closeModal(false)}>
              <img src={closeImg} alt="" />
            </div>
          </div>
          <div className="modal-setting__main">
            <div className="modal-setting__drop-drag drop-drag">
              {selectedListCities.length > 0 ? (
                selectedListCities.map((el, index) => (
                  <ModalSettingCities city={el} key={index} removeItem={removeItemCity} dropHandler={dropHandler} setCurrentCard={setCurrentCard} />
                ))
              ) : (
                <div className="message__empty">No selected cities</div>
              )}
            </div>
            <div className="modal-setting__add-city add-city">
              <div className="add-city__title">Add city</div>
              <div className="add-city__main">
                <input type="text" onChange={changedEnterValue} value={enteredValue} onKeyPress={addCityInProp} pattern="^[А-Яа-яЁё\s]+$" />
                <div className="button" onClick={addCityInProp}>
                  +
                </div>
              </div>

              <div className="error__message">{MessageError}</div>
            </div>
            <div className="modal-setting__buttons">
              <div className="modal-setting__buttons__item button__cancel" onClick={clickCancel}>
                Cancel
              </div>
              <div
                className="modal-setting__buttons__item button__save"
                onClick={() => {
                  closeModal(false);
                  clickSave(selectedListCities);
                }}
              >
                Save
              </div>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};
export default ModalSetting;
