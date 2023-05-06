import React, {useEffect, useRef, useState} from 'react';
import {replaceStyle} from "@/components/style";
import {ItemsSelector} from "@/components/ItemsSelector";
import {parseStudyWeeks} from "@/components/custom/type";
import {CustomTable} from "@/components/custom/CustomTable";
import {FaSpinner} from "react-icons/fa";

interface Props {
    URL: string;
}

export const TableModified = (props: Props) => {
    const {URL} = props;

    const ref = useRef<HTMLIFrameElement>();
    const [webpageFinalized, setWebpageFinalized] = useState('');
    const [webpage, setWebpage] = useState('');
    const [items, setItems] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([
        'Efektywność ekonomiczna i ekologiczna projektów inwestycyjnych',
        'Finanse Unii Europejskiej',
        'Język obcy - grupa przedmiotów',
        'Polityka finansowa',
        'Przeciwdziałanie nielegalnym praktykom w finansach',
        'Rachunkowość zarządcza'
    ]);

    useEffect(() => {
        fetch("/api/web", {
            body: JSON.stringify({
                URL
            }),
            method: 'POST'
        })
            .then((response) => response.json())
            .then(data => {
                const p = PrepareTable(data.html)
                setItems(p.items);
                setWebpage(p.html);
            })
            .catch((error) => console.error(error));
    }, [URL]);

    useEffect(() => {
        const finalized = FinalizeTable(webpage, selectedItems) as string;
        setWebpageFinalized(finalized);
        const blob = new Blob([finalized as any], {type: 'text/html'});
        // @ts-ignore
        ref.current.src = window.URL.createObjectURL(blob);
    }, [selectedItems, webpage]);


    return <>
        <div id='modify-canvas'/>

        {!items.length && <div className='my-20 flex items-center gap-4'>
            <FaSpinner className='animate-spin text-2xl'/> Ładowanie...
        </div>}

        <ItemsSelector items={items} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>

        <CustomTable webpageFinalized={webpageFinalized}/>

        <div className='my-20 border-b w-full text-center'>
            Oryginalna tabelka:
        </div>

        <Info/>

        <iframe
            ref={ref as any}
            id="my-iframe"
            className='w-full h-[2700px] border-0'
        />
    </>;
}

function Info() {
    function ColorBox({color, text}: {color: string, text: string}) {
        return <div className=''>
            <div className='flex items-center gap-2 text-sm font-semibold'>
                <div className='w-8 min-w-[2rem] h-8' style={{backgroundColor: color}}/>
                {text}
            </div>
        </div>
    }

    return <div className='w-full px-20 py-5'>
        <div className='font-bold'>Legenda:</div>
        <div className='flex flex-col gap-2 p-4 border'>
            <ColorBox color='#fccfff' text='Twoje wybrane przedmioty'/>
            <ColorBox color='#d1ffcf' text='Twoje wybrane przedmioty (Ten tydzień)'/>
            <ColorBox color='#cfd9ff' text='Twoje wybrane przedmioty (Następny tydzień)'/>
        </div>
        <div className='text-xs text-gray-500'>
            Strona jest pobierana z linku powyżej i modyfikowana tutaj. Powinna być więc aktualna. Dla sprawdzenia można
            zmienić `okres=2` na `okres=1`
        </div>
    </div>
}

function PrepareTable(html: any): { html: any, items: string[] } {
    const w = replaceStyle(html)
        .replaceAll(`<img src="ews.jpg" alt="e-Wizytówka">`, '👨‍🏫')
        .replaceAll(`<table border="1">`, '<table border="1" id="plan">');

    const modifyContainer = document.getElementById('modify-canvas');

    if (!modifyContainer) return {
        html: '',
        items: []
    };

    modifyContainer.innerHTML = w;

    const table: any = document.getElementById('plan');

    const items: string[] = [];

    for (let i = 1; i < table.rows.length; i++) {
        const itemName = table.rows[i].cells[2]?.textContent.trim();

        if (itemName && !items.includes(itemName)) {
            items.push(itemName);
        }
        // table.rows[i].classList.add('meine');
    }

    const modified = modifyContainer.innerHTML;

    modifyContainer.innerHTML = '';

    return {
        html: modified,
        items: items
    };
}

function FinalizeTable(html: any, selectedItems: string[]) {
    const modifyContainer = document.getElementById('modify-canvas');

    if (!modifyContainer) return {
        html: '',
        items: []
    };

    modifyContainer.innerHTML = html;

    const table: any  = document.getElementById('plan');

    if (!table) return '';

    const dateToCheck = '2023-05-14';
    const now = new Date(); // get current date
    const dayOfWeek = now.getDay(); // get day of week (0-6)

    const currentWeekendStartDate = new Date(now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000));
    const currentWeekendEndDate = new Date(currentWeekendStartDate.getTime() + (6 * 24 * 60 * 60 * 1000));
    currentWeekendStartDate.setDate(currentWeekendStartDate.getDate() + 1);
    currentWeekendEndDate.setDate(currentWeekendEndDate.getDate() + 1);

    const nextWeekendStartDate = new Date(currentWeekendEndDate.getTime() + (1 * 24 * 60 * 60 * 1000));
    const nextWeekendEndDate = new Date(nextWeekendStartDate.getTime() + (6 * 24 * 60 * 60 * 1000));
    nextWeekendStartDate.setDate(nextWeekendStartDate.getDate() + 1);
    nextWeekendEndDate.setDate(nextWeekendEndDate.getDate() + 1);

    // add meine classes
    for (let i = 1; i < table.rows.length; i++) {
        const itemName = table.rows[i].cells[2]?.textContent.trim();

        if (itemName && selectedItems.includes(itemName)) {
            table.rows[i].classList.add('meine');
        }

        const dateToCheck = table.rows[i].cells[0]?.textContent.trim();

        if (dateToCheck) {
            if (new Date(dateToCheck) >= currentWeekendStartDate && new Date(dateToCheck) <= currentWeekendEndDate) {
                table.rows[i].classList.add('thisweek');
            } else if (new Date(dateToCheck) >= nextWeekendStartDate && new Date(dateToCheck) <= nextWeekendEndDate) {
                table.rows[i].classList.add('nextweek');
            }
        }
    }


    // fix uwagi
    // Loop through the rows, starting from the second row
    for (let i = 1; i < table.rows.length; i++) {
        // Check if the current row has a td element with class "uwagi"
        if (table.rows[i].querySelector('.uwagi')) {
            // Check if the previous row has class "meine"
            const previousRow = table.rows[i - 1];
            if (previousRow && previousRow.classList.contains('meine')) {
                table.rows[i].classList.add('meine');
            }
            if (previousRow && previousRow.classList.contains('thisweek')) {
                table.rows[i].classList.add('thisweek');
            }
            if (previousRow && previousRow.classList.contains('nextweek')) {
                table.rows[i].classList.add('nextweek');
            }
        }
    }

    // remove okres
    const div = document.createElement("div");
    const form = document.querySelector('form[action="index.php"]');
    const o = form?.querySelector('option[selected]');
    div.innerHTML = o?.textContent as any;
    form?.parentNode?.replaceChild(div, form);

    const modified = modifyContainer.innerHTML;

    modifyContainer.innerHTML = '';

    return modified;
}

