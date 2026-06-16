import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { handleCloseSearchModal, handleOpenSearchModal } from "./searchSlice";

function SearchProducts() {
    const [search, setSearch] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);
    const { isOpenSearchModal } = useAppSelector((state) => state.searchSlice)
    const dispatch = useAppDispatch();
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleClickOpen = () => {
        dispatch(handleOpenSearchModal(true))
    };

    const handleClose = () => {
        dispatch(handleCloseSearchModal(false))
    };

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(
                    `${baseUrl}/products/search?q=${encodeURIComponent(search)}`
                );
                const data = await res.json();
                setSuggestions(data.products || []);
            } catch (error) {
                console.error("Search error:", error);
            }
        };

        const delayDebounce = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/products?search=${encodeURIComponent(search)}`);
    };

    return (
        <React.Fragment>
            <Button
                onClick={handleClickOpen}
                variant="outlined"
                size="small"
                sx={{
                    borderColor: "#ccc",
                    borderRadius: "50px",
                    width: { xs: "auto", md: "360px" },
                    display: "flex",
                    justifyContent: "start",
                    gap: "5px",
                    alignItems: "center",
                    color: "#525252",
                    textTransform:'capitalize'
                }}
            >
                <SearchIcon /> <span className="hidden md:block">Search...</span>
            </Button>
            <Dialog
                open={isOpenSearchModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-paper": {
                    width: "calc(100% - 15px)",
                    margin: "11px",
                    }
                }}
            >
                <div className="relative">
                    <form onSubmit={handleSearch}>
                        <div className="border-b border-gray-400 sticky top-0 flex items-center gap-x-2 px-4">
                            <SearchIcon />
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                className="w-full px-2 py-3 outline-none"
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                    </form>
                    {search == "" ? (
                        <div className="p-3 h-[500px] overflow-y-auto">
                            <div className="mt-3 mb-2 px-1.5">
                                <h3 className="text-[15px] font-medium text-gray-700">
                                    Latest Collection
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-y-3">
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link href="#">
                                        <Image
                                            src="/assets/img/800X400.webp"
                                            alt="800X400"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                </div>
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link href="#">
                                        <Image
                                            src="/assets/img/800X400.webp"
                                            alt="800X400"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-3 mb-2 px-1.5">
                                <h3 className="text-[15px] font-medium text-gray-700">
                                    Category Items
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-y-3">
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link
                                        className="bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]"
                                        href="#"
                                    >
                                        Women
                                    </Link>
                                </div>
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link
                                        className="bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]"
                                        href="#"
                                    >
                                        Men
                                    </Link>
                                </div>
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link
                                        className="bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]"
                                        href="#"
                                    >
                                        Kids
                                    </Link>
                                </div>
                                <div className="w-full lg:w-[50%] px-1.5">
                                    <Link
                                        className="bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]"
                                        href="#"
                                    >
                                        All
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-2 h-[500px] overflow-y-auto max-w-full w-[800px]">
                            <div className="flex items-center gap-x-2">
                                <SearchIcon />
                                <p className="px-2 py-3">All the search result for "{search}"</p>
                            </div>
                            <div>
                                {suggestions.length > 0 && (
                                    <ul className="absolute left-0 w-full mt-1 rounded-lg max-h-60 overflow-auto z-50">
                                        {suggestions.map((item: any) => (
                                            <li
                                                key={item._id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => router.push(`/products?search=${encodeURIComponent(item.name)}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <SearchIcon />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.brand} — {item.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="sticky bottom-0 bg-gray-50 py-4 px-5 border-t border-gray-300">
                        <p className="text-[13px] text-gray-600">Search By</p>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
}

export default SearchProducts;
