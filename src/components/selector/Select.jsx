import Select from 'react-select';

import styles from './Select.module.scss'
// eslint-disable-next-line react/prop-types
export const CustomSelect = ({ optionsArray, title, onChange, value  }) => {
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
            marginTop: '30px',
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
        menu: (provided) => ({
            ...provided,
            marginTop: '5px',
            borderRadius: '11px',
            background: 'linear-gradient(180deg, #5c498f 0%, #47347d 100%)',
            color: '#fff',
            zIndex: '1000'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#47347d' : state.isFocused ? '#47347d' : 'transparent',
            color: state.isSelected ? '#fff' : '#fff',
            fontSize: '20px',
            borderRadius: state.isSelected ? '10px' : 'none',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: state.isSelected ? 'normal' : 'normal',
        }),
    };

    return (
        <div className={styles.root}>
            <div className={styles.label}>{title}</div>
            <Select
                onChange={onChange}
                options={optionsArray}
                styles={customStyles}
                placeholder="Select Language"
                isSearchable={false}
                value={value}
            />
        </div>

    );
};