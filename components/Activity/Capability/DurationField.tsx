import { padZero } from "~/helpers/formatter.helper";
import { useEffect, useState } from "react";
import { InputGroup, InputGroupInput, InputGroupText } from "~/components/ui/input-group";

export interface DurationFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}

export const DurationField = ({ id, value, onChange, invalid }: DurationFieldProps) => {
  const [localDuration, setLocalDuration] = useState(() => {
    const t = parseFloat(value || '0');
    return {
      h: value ? padZero(Math.floor(t / 3600)) : '',
      m: value ? padZero(Math.floor((t % 3600) / 60)) : '',
      s: value ? padZero(Math.floor(t % 60)) : ''
    };
  });

  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalDuration({ h: '', m: '', s: '' });
    }
  }, [value]);

    const handleDurChange = (type: 'h' | 'm' | 's', rawVal: string) => {
      let cleanVal = rawVal.replace(/\D/g, '');

      if (type === 'h') {
        cleanVal = cleanVal.slice(0, 3);
      } else {
        cleanVal = cleanVal.slice(0, 2);
        if (Number(cleanVal) > 59) {
          cleanVal = '59';
        }
      }

      const newDuration = { ...localDuration, [type]: cleanVal };
      setLocalDuration(newDuration);

      if (!newDuration.h && !newDuration.m && !newDuration.s) {
        onChange('');
      } else {
        const total = (Number(newDuration.h || 0) * 3600) + (Number(newDuration.m || 0) * 60) + Number(newDuration.s || 0);
        onChange(total.toString());
      }
    };

    const handleBlur = (type: 'h' | 'm' | 's') => {
      setLocalDuration(prev => ({ ...prev, [type]: padZero(prev[type]) }));
    };

    return (
      <InputGroup>
        <InputGroupInput
          id={`${id}-hrs`}
          aria-invalid={invalid}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="00"
          value={localDuration.h}
          onChange={(e) => handleDurChange('h', e.target.value)}
          onBlur={() => handleBlur('h')}
          onFocus={(e) => e.target.select()}
        />
        <InputGroupText className="px-1 font-bold bg-transparent border-none">:</InputGroupText>

        <InputGroupInput
          id={`${id}-min`}
          aria-invalid={invalid}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="00"
          value={localDuration.m}
          onChange={(e) => handleDurChange('m', e.target.value)}
          onBlur={() => handleBlur('m')}
          onFocus={(e) => e.target.select()}
        />
        <InputGroupText className="shrink-0 px-1 font-bold bg-transparent border-none">:</InputGroupText>

        <InputGroupInput
          id={`${id}-sec`}
          aria-invalid={invalid}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="00"
          value={localDuration.s}
          onChange={(e) => handleDurChange('s', e.target.value)}
          onBlur={() => handleBlur('s')}
          onFocus={(e) => e.target.select()}
        />
        <InputGroupText className="shrink-0 pr-4 text-xs font-mono text-muted-foreground">
          HH:MM:SS
        </InputGroupText>
      </InputGroup>
    );
}
