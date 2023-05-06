import {useState} from "react";
import 'tailwindcss/tailwind.css';
import {TableModified} from "@/components/TableModified";

const DEFAULT_URL = 'https://planzajec.uek.krakow.pl/index.php?typ=G&id=189651&okres=2';
// const DEFAULT_URL = 'https://example.com';

function Input({ value, setValue }: { value: any, setValue: any }) {
    return <input
        className='w-full p-2 border border-gray-700'
        type='text'
        value={value}
        onChange={event => setValue(event.target.value)}
    />
}

export default function Page() {
    const [URL, setURL] = useState(DEFAULT_URL);

    return <div className="flex min-h-screen flex-col w-full items-center">
        <Input value={URL} setValue={setURL} />

        <TableModified URL={URL}/>
    </div>
}