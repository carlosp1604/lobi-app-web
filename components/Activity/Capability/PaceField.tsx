import { padZero } from "~/helpers/formatter.helper";
import { useEffect, useState } from "react";
import { InputGroup, InputGroupInput, InputGroupText } from "~/components/ui/input-group";

interface PaceFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  unit: string;
}

export const PaceField = ({ id, value, onChange, invalid, unit}: PaceFieldProps) => {
  const [localPace, setLocalPace] = useState(() => {
    const totalSeconds = parseFloat(value || '0');
    return {
      m: value ? padZero(Math.floor(totalSeconds / 60)) : '',
      s: value ? padZero(Math.floor(totalSeconds % 60)) : ''
    };
  });

  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPace({ m: '', s: '' });
    }
  }, [value]);

  const handlePaceChange = (type: 'm' | 's', rawVal: string) => {
    let cleanVal = rawVal.replace(/\D/g, '');

    if (type === 'm') {
      cleanVal = cleanVal.slice(0, 4);
    } else {
      cleanVal = cleanVal.slice(0, 2);
      if (Number(cleanVal) > 59) {
        cleanVal = '59';
      }
    }

    const newPace = { ...localPace, [type]: cleanVal };
    setLocalPace(newPace);

    if (!newPace.m && !newPace.s) {
      onChange('');
    } else {
      const totalSecs = (Number(newPace.m || 0) * 60) + Number(newPace.s || 0);
      onChange(totalSecs.toString());
    }
  };

  const handleBlur = (type: 'm' | 's') => {
    setLocalPace(prev => ({ ...prev, [type]: padZero(prev[type]) }));
  };

  return (
    <InputGroup>
      <InputGroupInput
        id={`${id}-min`}
        aria-invalid={invalid}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="00"
        value={localPace.m}
        onChange={(e) => handlePaceChange('m', e.target.value)}
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
        value={localPace.s}
        onChange={(e) => handlePaceChange('s', e.target.value)}
        onBlur={() => handleBlur('s')}
        onFocus={(e) => e.target.select()}
      />
      <InputGroupText className="shrink-0 pr-4">{unit}</InputGroupText>
    </InputGroup>
  );
}
