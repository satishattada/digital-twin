import React, { useState, useRef, useEffect } from "react";

interface Store {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: "operational" | "warning" | "critical";
    revenue: number;
    growth: string;
    alerts: number;
    tasks: number;
}

interface MapInterfaceProps {
    onStoreSelect?: (storeId: string) => void;
    selectedStore?: string;
    stores?: Store[];
}

// Mock store data
const MOCK_STORES: Store[] = [
    {
        id: "BP-001",
        name: "BP Kempton Park",
        latitude: 51.4167,
        longitude: -0.4167,
        status: "operational",
        revenue: 125000,
        growth: "+12%",
        alerts: 2,
        tasks: 6,
    },
    {
        id: "BP-002",
        name: "BP Hatton Cross",
        latitude: 51.4667,
        longitude: -0.4167,
        status: "warning",
        revenue: 98000,
        growth: "+8%",
        alerts: 1,
        tasks: 4,
    },
    {
        id: "BP-003",
        name: "BP Ashford SF",
        latitude: 51.1467,
        longitude: 0.8667,
        status: "critical",
        revenue: 87000,
        growth: "+15%",
        alerts: 3,
        tasks: 8,
    },
];

const MapInterface: React.FC<MapInterfaceProps> = ({
    onStoreSelect,
    selectedStore,
    stores = MOCK_STORES,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [filteredStores, setFilteredStores] = useState(stores);
    const mapRef = useRef<HTMLIFrameElement>(null);

    // Filter stores based on search
    useEffect(() => {
        if (searchValue) {
            setFilteredStores(
                stores.filter((store) =>
                    store.name.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else {
            setFilteredStores(stores);
        }
    }, [searchValue, stores]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleStoreClick = (storeId: string) => {
        onStoreSelect?.(storeId);
    };

    const getStatusColor = (status: Store["status"]) => {
        switch (status) {
            case "operational":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusTextColor = (status: Store["status"]) => {
        switch (status) {
            case "operational":
                return "text-green-700";
            case "warning":
                return "text-yellow-700";
            case "critical":
                return "text-red-700";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="map-container">
            <div className="search-wrapper bg-gray-50  flex flex-col map-search-list">
                <div className="app__sidebar app__sidebar--has-content">
                    <div className="search__wrapper">
                        <div
                            className="search search--with-after"
                            role="search"
                        >
                            <div className="search__input-line search__input-line--filled">
                                <span className="search-icon">
                                    <span className="search__left-icon">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0.746513 19.913L6.33153 14.328C7.827 15.6675 9.76453 16.4075 11.7722 16.406C16.2817 16.406 19.9504 12.7373 19.9504 8.22777C19.9504 3.7183 16.2817 0.0495605 11.7722 0.0495605C7.26274 0.0495605 3.59403 3.7183 3.59403 8.22777C3.59246 10.2355 4.33248 12.173 5.67204 13.6685L0.0870247 19.2535C-0.000429153 19.3409 -0.0495605 19.4596 -0.0495605 19.5832C-0.0495605 19.7069 -0.000429153 19.8255 0.0870247 19.913C0.174479 20.0004 0.293091 20.0496 0.416769 20.0496C0.540447 20.0496 0.65906 20.0004 0.746513 19.913ZM11.7722 0.982203C15.7675 0.982203 19.0178 4.23254 19.0178 8.22777C19.0178 12.223 15.7675 15.4733 11.7722 15.4733C7.77703 15.4733 4.52667 12.223 4.52667 8.22777C4.52667 4.23254 7.77703 0.982203 11.7722 0.982203Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </span>
                                    <label
                                        className="search__input--floating-label"
                                        htmlFor="search-input"
                                    >
                                        Search
                                    </label>
                                </span>
                                <input
                                    className="search__input"
                                    role="searchbox"
                                    spellCheck={false}
                                    autoComplete="off"
                                    title=""
                                    id="search-input"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div
                                className="search__after-content"
                                style={{
                                    flexBasis: "auto",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <button
                                    className="button-with-icon app__sidebar-filter-toggle-button"
                                    aria-disabled="false"
                                    aria-label="Route planner"
                                    title="Route planner"
                                >
                                    <div className="button-with-icon__icon">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M11.9999 23.9405C11.9297 23.9406 11.8602 23.9268 11.7953 23.9C11.7304 23.8731 11.6715 23.8337 11.6219 23.784L0.215937 12.378C0.166287 12.3284 0.126901 12.2694 0.100029 12.2046C0.0731571 12.1397 0.0593262 12.0702 0.0593262 12C0.0593262 11.9298 0.0731571 11.8603 0.100029 11.7954C0.126901 11.7306 0.166287 11.6716 0.215937 11.622L11.6219 0.215998C11.6716 0.166348 11.7305 0.126962 11.7954 0.10009C11.8602 0.0732181 11.9297 0.0593872 11.9999 0.0593872C12.0701 0.0593872 12.1397 0.0732181 12.2045 0.10009C12.2694 0.126962 12.3283 0.166348 12.3779 0.215998L23.7839 11.622C23.8336 11.6716 23.873 11.7306 23.8998 11.7954C23.9267 11.8603 23.9405 11.9298 23.9405 12C23.9405 12.0702 23.9267 12.1397 23.8998 12.2046C23.873 12.2694 23.8336 12.3284 23.7839 12.378L12.3779 23.784C12.3283 23.8337 12.2694 23.8731 12.2046 23.9C12.1397 23.9268 12.0701 23.9406 11.9999 23.9405ZM1.35018 12L11.9999 22.6498L22.6497 12L11.9999 1.35024L1.35018 12ZM9.63018 16.8564H8.88282C8.59268 16.856 8.31454 16.7406 8.10938 16.5354C7.90422 16.3303 7.7888 16.0521 7.78842 15.762V12.732C7.78842 10.8377 9.3297 9.2964 11.224 9.2964H13.0492L12.8879 8.23392C12.8867 8.22552 12.8855 8.21712 12.8848 8.20872C12.8659 8.02835 12.9006 7.84642 12.9844 7.68562C13.0683 7.52482 13.1976 7.39227 13.3563 7.30452C13.515 7.21677 13.6961 7.1777 13.8768 7.19219C14.0576 7.20668 14.2301 7.27409 14.3728 7.386C14.386 7.39632 14.3987 7.40736 14.411 7.41888L17.5967 10.4429C17.6494 10.4928 17.6913 10.5529 17.7199 10.6196C17.7486 10.6863 17.7633 10.758 17.7633 10.8306C17.7633 10.9031 17.7486 10.9749 17.7199 11.0416C17.6913 11.1083 17.6494 11.1684 17.5967 11.2183L14.411 14.2423C14.3987 14.2538 14.387 14.2649 14.3728 14.2752C14.2301 14.3871 14.0576 14.4545 13.8768 14.469C13.6961 14.4835 13.515 14.4444 13.3563 14.3567C13.1976 14.2689 13.0683 14.1364 12.9844 13.9756C12.9006 13.8148 12.8659 13.6328 12.8848 13.4525C12.8848 13.4446 12.8865 13.4369 12.8877 13.4285L13.0663 12.234L11.4544 12.2299C11.261 12.2304 11.0757 12.3076 10.939 12.4445C10.8023 12.5813 10.7255 12.7668 10.7253 12.9602V15.762C10.725 16.0523 10.6094 16.3306 10.4041 16.5358C10.1987 16.741 9.92026 16.8563 9.62994 16.8564H9.63018ZM11.2243 10.3658C10.5969 10.3665 9.99549 10.6161 9.5519 11.0596C9.10831 11.5032 8.8588 12.1047 8.8581 12.732V15.762C8.8581 15.7684 8.86063 15.7745 8.86513 15.779C8.86963 15.7835 8.87573 15.786 8.8821 15.786H9.62922C9.63558 15.786 9.64169 15.7835 9.64619 15.779C9.65069 15.7745 9.65322 15.7684 9.65322 15.762V12.9624C9.65366 12.4851 9.84345 12.0276 10.1809 11.6901C10.5184 11.3526 10.976 11.1628 11.4532 11.1624L13.6852 11.1679C13.7621 11.168 13.838 11.1846 13.9078 11.2167C13.9776 11.2488 14.0397 11.2956 14.0898 11.3538C14.1399 11.4121 14.1769 11.4804 14.1982 11.5542C14.2195 11.6281 14.2246 11.7056 14.2132 11.7816L14.0087 13.1496L16.4503 10.8314L14.0116 8.51496L14.2005 9.75024C14.2121 9.82636 14.2071 9.90408 14.186 9.97811C14.1648 10.0521 14.1278 10.1207 14.0777 10.1792C14.0276 10.2376 13.9654 10.2845 13.8955 10.3168C13.8256 10.349 13.7495 10.3657 13.6725 10.3658H11.2243Z"
                                                fill="#666666"
                                            ></path>
                                        </svg>
                                    </div>
                                </button>
                                <button
                                    className="button-with-icon app__sidebar-filter-toggle-button"
                                    aria-disabled="false"
                                    aria-label="Filters"
                                    title="Filters"
                                >
                                    <div className="button-with-icon__icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            width="28"
                                            height="25"
                                            viewBox="0 0 28 25"
                                        >
                                            <path
                                                fill="#666"
                                                d="M26.84 12.36h-2.17a3.88 3.88 0 0 0-7.67.01H.68a.61.61 0 0 0-.61.62.6.6 0 0 0 .61.6h16.34a3.88 3.88 0 0 0 7.67 0h2.16a.61.61 0 0 0 .6-.62.6.6 0 0 0-.6-.6Zm-6 3.27A2.67 2.67 0 0 1 18.39 14a2.63 2.63 0 0 1 1.93-3.6 2.67 2.67 0 0 1 3.18 2.59 2.64 2.64 0 0 1-2.66 2.64ZM.67 5.35h2.15a3.88 3.88 0 0 0 7.68.11l16.34.01a.61.61 0 0 0 .6-.61.6.6 0 0 0-.6-.61L10.5 4.24a3.88 3.88 0 0 0-7.65-.11H.67a.61.61 0 0 0-.6.6.6.6 0 0 0 .6.62Zm6-3.14a2.67 2.67 0 0 1 2.45 1.63 2.63 2.63 0 0 1-1.93 3.6A2.67 2.67 0 0 1 4 4.85a2.64 2.64 0 0 1 2.66-2.64Zm20.17 18.3H10.5a3.88 3.88 0 0 0-7.67.01H.67a.61.61 0 0 0-.6.61.6.6 0 0 0 .6.61h2.17a3.88 3.88 0 0 0 7.66 0h16.34a.61.61 0 0 0 .6-.62.6.6 0 0 0-.6-.61ZM6.67 23.76a2.67 2.67 0 0 1-2.46-1.63 2.63 2.63 0 0 1 1.94-3.6 2.67 2.67 0 0 1 3.18 2.59 2.64 2.64 0 0 1-2.66 2.64Z"
                                            ></path>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="info-window">
                        <div className="info-window__title">
                            <h1 className="info-window__title-name">
                                HERRINGHTORPE S/S
                            </h1>
                            <button
                                className="info-window__title-button"
                                aria-label="More Info"
                                title="More Info"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                ></svg>
                            </button>
                        </div>

                        <div className="info-window__info">
                            <div className="info-window__info-list">
                                <div>
                                    Herringthorpe Valley Road 
                                    S65 2UQ
                                    Rotherham
                                </div>
                                <a
                                    className="info-window__link"
                                    href="tel:+44 1709 539010"
                                    target="_blank"
                                >
                                    +44 1709 539010
                                </a>
                                <div className="info-window__distance">
                                    0 miles
                                </div>
                            </div>
                            <div className="info-window__item-open-now">
                                <span
                                    className="open-now open-now--is-open"
                                    data-testid="open-now"
                                >
                                    Open 24 Hours
                                </span>
                            </div>
                        </div>

                        <div className="info-window__links">
                            <button className="info-window__link-button info-window__link-button--">
                                Get directions
                            </button>
                            <a
                              className="info-window__link-button"
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                // Navigate to site manager screen
                                window.location.href = '/store-manager';
                              }}
                            >
                              Navigate to site
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="info-window__link-button-icon"
                              >
                                <path
                                  d="M3.475 10.25C3.275 10.25 3.10417 10.1792 2.9625 10.0375C2.82083 9.89583 2.75 9.725 2.75 9.525V2.475C2.75 2.275 2.82083 2.10417 2.9625 1.9625C3.10417 1.82083 3.275 1.75 3.475 1.75H6.6125V2.3125H3.475C3.43333 2.3125 3.39583 2.32917 3.3625 2.3625C3.32917 2.39583 3.3125 2.43333 3.3125 2.475V9.525C3.3125 9.56667 3.32917 9.60417 3.3625 9.6375C3.39583 9.67083 3.43333 9.6875 3.475 9.6875H10.525C10.5667 9.6875 10.6042 9.67083 10.6375 9.6375C10.6708 9.60417 10.6875 9.56667 10.6875 9.525V6.3875H11.25V9.525C11.25 9.725 11.1792 9.89583 11.0375 10.0375C10.8958 10.1792 10.725 10.25 10.525 10.25H3.475ZM5.8 7.6L5.4 7.2L10.2875 2.3125H7.625V1.75H11.25V5.375H10.6875V2.725L5.8 7.6Z"
                                  fill="#666666"
                                ></path>
                              </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <iframe
                ref={mapRef}
                title="Store Map"
                width="100%"
                height="600"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://bpretaillocator.geoapp.me/?locale=en_GB`}
            />
        </div>
    );
};

export default MapInterface;
