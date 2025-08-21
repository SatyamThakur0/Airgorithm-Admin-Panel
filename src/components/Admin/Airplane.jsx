import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AirplaneForm } from "../forms/AirplaneForm";

export default function AirplanesPage() {
    const [formData, setFormData] = useState({});

    return (
        <Card className="w-full h-screen">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold">
                    Create Airplane
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
                <AirplaneForm
                    formData={formData}
                    onFormDataChange={setFormData}
                />
            </CardContent>
        </Card>
    );
}
