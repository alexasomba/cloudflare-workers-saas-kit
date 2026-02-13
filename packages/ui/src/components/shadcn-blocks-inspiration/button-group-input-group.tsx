'use client';

import * as React from 'react';
import { Microphone, Plus } from '@phosphor-icons/react';

import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';

export function ButtonGroupInputGroup() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);
  return (
    <ButtonGroup className="[--radius:9999rem]">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Add">
          <Plus />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup>
          <InputGroupInput
            placeholder={voiceEnabled ? 'Record and send audio...' : 'Send a message...'}
            disabled={voiceEnabled}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger>
                <InputGroupButton
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  data-active={voiceEnabled}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  aria-pressed={voiceEnabled}
                  size="icon-xs"
                  aria-label="Voice Mode"
                >
                  <Microphone />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
