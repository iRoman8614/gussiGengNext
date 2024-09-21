import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Select.module.scss'

export const CustomSelect = ({ optionsArray, title }) => {
    const [selectedOption, setSelectedOption] = useState(optionsArray[0] || null);

    useEffect(() => {
        if (optionsArray.length > 0) {
            setSelectedOption(optionsArray[0]);
        }
    }, [optionsArray]);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '11px',
            width: '100%',
            height: '70px',
            background: 'linear-gradient(180deg, #5c498f 0%, #47347d 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: 'none',
            boxShadow: 'none',
        }),
        placeholder: (provided) => ({
            ...provided,
            position: 'absolute',
            top: '10px',
            left: '15px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
        }),
        singleValue: (provided) => ({
            ...provided,
            marginTop: '30px', // Чтобы выбранный элемент был ниже плейсхолдера
            color: '#fff',
            fontSize: '18px',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        // Выпадающий список
        menu: (provided) => ({
            ...provided,
            marginTop: '5px',
            borderRadius: '11px',
            background: 'linear-gradient(180deg, #5c498f 0%, #47347d 100%)',
            color: '#fff',
        }),
        // Стиль для каждой опции
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#47347d' : state.isFocused ? '#47347d' : 'transparent',
            color: state.isSelected ? '#fff' : '#fff', // цвет текста для выбранной и других опций
            fontSize: '18px',
            borderRadius: state.isSelected ? '10px' : 'none',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: state.isSelected ? 'bold' : 'normal', // жирный шрифт для выбранной опции
        }),
    };

    return (
        <div className={styles.root}>
            <div className={styles.label}>{title}</div>
            <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={optionsArray}
                styles={customStyles}
                placeholder="Select Language"
                isSearchable={false}
                defaultValue={optionsArray[0]}
            />
        </div>

    );
};
