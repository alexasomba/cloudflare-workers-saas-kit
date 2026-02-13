import { BracketsCurly, Copy, CornerDownLeft, ArrowClockwise } from '@phosphor-icons/react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@workspace/ui/components/input-group';

export function InputGroupTextareaExample() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-45"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <CornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <BracketsCurly />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto">
            <ArrowClockwise />
          </InputGroupButton>
          <InputGroupButton variant="ghost">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
