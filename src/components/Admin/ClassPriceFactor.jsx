import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function ClassPriceFactors({
    economyFactor,
    premiumFactor,
    businessFactor,
    onFactorChange,
    prefix = "",
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label className="text-sm">{prefix}Economy Factor</Label>
                <Input
                    type="number"
                    step="0.1"
                    value={economyFactor}
                    onChange={(e) =>
                        onFactorChange(
                            "economy",
                            Number.parseFloat(e.target.value) || 1.2
                        )
                    }
                    placeholder="1.2"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-sm">{prefix}Premium Factor</Label>
                <Input
                    type="number"
                    step="0.1"
                    value={premiumFactor}
                    onChange={(e) =>
                        onFactorChange(
                            "premium",
                            Number.parseFloat(e.target.value) || 2
                        )
                    }
                    placeholder="2.0"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-sm">{prefix}Business Factor</Label>
                <Input
                    type="number"
                    step="0.1"
                    value={businessFactor}
                    onChange={(e) =>
                        onFactorChange(
                            "business",
                            Number.parseFloat(e.target.value) || 3.5
                        )
                    }
                    placeholder="3.5"
                    required
                />
            </div>
        </div>
    );
}
