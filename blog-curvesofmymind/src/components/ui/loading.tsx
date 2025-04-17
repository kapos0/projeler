import React from "react";

export default function Loading() {
    return (
        <div className="w-full h-full fixed top-0 left-0 z-50">
            <div className="flex justify-center items-center">
                <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
                </div>
            </div>
        </div>
    );
}
