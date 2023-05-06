import React from 'react';
import {FaCheck} from "react-icons/fa";

interface Props {
    items: string[];
    selectedItems: string[];

    setSelectedItems(items: string[]): void;
}

export const ItemsSelector = (props: Props) => {
    const {items, selectedItems, setSelectedItems} = props;

    const Item = ({item}: {item: string}) => {
        return <div
            className='cursor-pointer border border-gray-700 overflow-hidden h-12 text-xs font-bold bg-white flex items-center gap-2 pr-2'
            onClick={() => {
                let si = selectedItems;
                if (selectedItems.includes(item)) {
                    // Remove the string from the array
                    si = si.filter(i => i !== item);
                } else {
                    // Add the string to the array
                    si.push(item);
                }

                setSelectedItems([...si])
            }}
        >
            <div className='w-12 h-12 min-w-[3rem] bg-gray-100 flex items-center justify-center text-2xl text-green-600'>
                {selectedItems.includes(item) && <FaCheck/>}
            </div>
            {item}
        </div>;
    }

    return <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-4 gap-x-12 p-10'>
        {items.map(i => <Item key={i} item={i}/>)}
    </div>;
}
