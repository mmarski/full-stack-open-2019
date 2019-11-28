import React from 'react'

const FilterForm = ({value, onChange}) => {
    return (
        <form>
            <div>
                Filter shown with <input value={value} onChange={onChange}></input>
            </div>
        </form>
    )
}

export default FilterForm;