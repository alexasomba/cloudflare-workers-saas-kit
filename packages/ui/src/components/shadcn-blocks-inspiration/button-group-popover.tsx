import { Robot, CaretDown } from '@phosphor-icons/react';

import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';

export function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm">
        <Robot /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" size="icon-sm" aria-label="Open Popover">
            <CaretDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-xl p-0 text-sm">
          <div className="px-4 py-3">
            <div className="text-sm font-medium">Agent Tasks</div>
          </div>
          <Separator />
          <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
            <Textarea
              placeholder="Describe your task in natural language."
              className="mb-4 resize-none"
            />
            <p className="font-medium">Start a new task with Copilot</p>
            <p className="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the background and open a
              pull request for your review.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
