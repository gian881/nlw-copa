import { HStack } from 'native-base';
import CountryFlag from "react-native-country-flag";

import { Input } from './Input';

interface Props {
  code: string;
  position: 'left' | 'right';
  onChangeText: (value: string) => void;
  points?: string
}

export function Team({ code, position, onChangeText, points }: Props) {
  return (
    <HStack alignItems="center">
      {position === 'left' ? <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} /> : null}

      {points
        ?
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize="xs"
          keyboardType="numeric"
          onChangeText={onChangeText}
          value={points}
          isDisabled={true}
        />

        :
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize="xs"
          keyboardType="numeric"
          onChangeText={onChangeText}
        />

      }

      {position === 'right' ? <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} /> : null}
    </HStack>
  );
}