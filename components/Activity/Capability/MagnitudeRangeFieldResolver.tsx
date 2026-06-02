import { PaceField } from "~/components/Activity/Capability/PaceField";
import { DurationField } from "~/components/Activity/Capability/DurationField";
import { InputGroup, InputGroupInput, InputGroupText } from "~/components/ui/input-group";

interface MagnitudeInputResolverProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  unit: string;
  capabilityName: string;
}

export function MagnitudeInputResolver({
  id,
  value,
  onChange,
  invalid,
  unit,
  capabilityName
}: MagnitudeInputResolverProps) {
  if (capabilityName === 'pace') {
    return (
      <PaceField
        id={ id }
        value={ value}
        onChange={ onChange }
        invalid={ invalid }
        unit={ unit }
      />
    )
  }

  if (capabilityName === 'duration') {
    return (
      <DurationField
        id={ id }
        value={ value}
        onChange={ onChange }
        invalid={ invalid }
      />
    )
  }

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        aria-invalid={invalid}
        placeholder="0"
        value={value ?? ''}
        type="number"
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupText className="shrink-0 pr-4">
        {unit}
      </InputGroupText>
    </InputGroup>
  );
}
