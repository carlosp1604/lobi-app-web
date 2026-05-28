import useTranslation from "next-translate/useTranslation";
import { Input } from "~/components/ui/input";
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Field, FieldLabel } from "~/components/ui/field";
import { useAutocompleteSuggestions } from "~/hooks/useAutocompleteSuggestions";
import { useCallback, useState, ChangeEvent } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "~/components/ui/command";

interface Props {
  onPlaceSelect: (place: google.maps.LatLngLiteral) => void;
}

export const PlaceAutocomplete = ({onPlaceSelect}: Props) => {
  const places = useMapsLibrary('places');

  const { t, lang } = useTranslation('common');

  const [inputValue, setInputValue] = useState<string>('');
  const {suggestions, resetSession} = useAutocompleteSuggestions(inputValue, { language: lang });
  const [isOpen, setIsOpen] = useState(false)

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setInputValue(value);
    setIsOpen(value.length > 0);
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) {
        return;
      }

      if (!suggestion.placePrediction) {
        return;
      }

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({ fields: ['location'] });

      setInputValue('');
      setIsOpen(false);

      resetSession();

      if (place.location) {
        onPlaceSelect({ lat: place.location.lat(), lng: place.location.lng() });
      }
    },
    [places, onPlaceSelect]
  );

  return (
    <div className="autocomplete-container">
      <Field>
        <FieldLabel htmlFor="places-autocomplete-input-id">
          {t('map_search_label_title')}
        </FieldLabel>
        <Popover
          open={isOpen && suggestions.length > 0}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger asChild>
            <Input
              id="places-autocomplete-input-id"
              type="text"
              autoComplete="off"
              value={inputValue}
              placeholder={t('map_search_input_placeholder_title')}
              onChange={(event) => handleInput(event)}
            />
          </PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandList>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.placePrediction?.placeId}
                      value={suggestion.placePrediction?.placeId}
                      onSelect={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer"
                    >
                      <span className="font-medium">
                        {suggestion.placePrediction?.mainText?.text}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        {suggestion.placePrediction?.secondaryText?.text}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Field>
    </div>
  );
};
