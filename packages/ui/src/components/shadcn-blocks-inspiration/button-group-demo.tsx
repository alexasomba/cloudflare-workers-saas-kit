'use client';

import * as React from 'react';
import {
  ArchiveBox,
  ArrowLeft,
  CalendarPlus,
  Clock,
  List,
  EnvelopeSimple,
  DotsThree,
  Tag,
  Trash,
} from '@phosphor-icons/react';

import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

export function ButtonGroupDemo() {
  const [label, setLabel] = React.useState('personal');

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon-sm" aria-label="Go Back">
          <ArrowLeft />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Archive
        </Button>
        <Button variant="outline" size="sm">
          Report
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Snooze
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon-sm" aria-label="More Options">
              <DotsThree />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 [--radius:1rem]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <EnvelopeSimple />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveBox />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Clock />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlus />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <List />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Tag />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                    <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
