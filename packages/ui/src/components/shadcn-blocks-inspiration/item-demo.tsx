import { CreditCard, CaretRight } from '@phosphor-icons/react';

import { Button } from '@workspace/ui/components/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@workspace/ui/components/item';

export function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription className="text-pretty xl:hidden 2xl:block">
            Verify via email or phone number.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Enable</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <a href="#" className="flex w-full items-center">
          <ItemMedia>
            <CreditCard className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <CaretRight className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  );
}
