import React from "react";

const Signature = ({ label, signer, date = false }) => {
    return (
        <div className="flex flex-col gap-6">
            <h4 className="header-sm">{label}</h4>
            <div className="w-full gap-4">
                <h4 className="header-sm">
                    ___________________________________
                </h4>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-1">
                        <p className="label-base">{signer}</p>
                        <p className="body-base">(Signature over Printed Name)</p>
                    </div>
                    {date && (
                        <p className="label-base">Date: ______________________________________________</p>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default Signature;