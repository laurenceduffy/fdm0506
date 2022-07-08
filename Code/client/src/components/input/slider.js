const Slider = ({value, setValue, min, max, step}) => {
    const changeValue = e => {
        setValue(e.target.value);
    }

    return (
        <>
            <input step={step} min={min} max={max} value={value} type="range" onChange={changeValue} />
        </>
    );
}

export default Slider;