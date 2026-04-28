import Image from "next/image";

export default function Story() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center relative">
            {/* Image with absolute positioning */}
            <Image
                className="w-full h-full object-cover"
                src={"/kitt.png"}
                alt="logo"
                fill
            />

            {/* "Hello" text positioned in the right center */}
            <div className="bg-white flex flex-col w-1/2 absolute right-0 top-1/2 transform -translate-y-1/2 text-black p-4">
                <h1 className="text-4xl font-bold flex items-center">Our Story</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias voluptatum laborum animi explicabo tempore pariatur ullam voluptates voluptas ut quisquam corporis vel consectetur, impedit neque commodi nulla ducimus aspernatur expedita? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus nam, necessitatibus minus reiciendis a velit dolore. Non vel unde, facilis sint praesentium accusantium laudantium exercitationem in assumenda facere, nesciunt ipsum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea repellat aperiam ipsa eveniet. Pariatur tenetur consequuntur, necessitatibus fuga ratione expedita earum reprehenderit quos similique blanditiis culpa tempora rem rerum. Sunt? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit accusantium recusandae vero quam ab! Quidem sequi non perspiciatis ducimus, libero similique quaerat natus incidunt! Provident vero optio repellat veritatis. Laudantium.</p>
            </div>
        </div>
    );
}
