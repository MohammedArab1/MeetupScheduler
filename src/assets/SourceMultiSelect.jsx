import {
	CheckIcon,
	Combobox,
	Group,
	Input,
	Pill,
	PillsInput,
	useCombobox,
	Text,
	Flex,
	Grid,
	Checkbox,
	ScrollArea,
} from '@mantine/core';
import { useState } from 'react';
import { TagOptionPill } from './TagOptionPill';
import { IconCircleFilled, IconCheck } from '@tabler/icons-react';
import classes from '../../styles/TagPill.module.css';
import { SourceOptionPill } from './SourceOptionPill';

export function SourceMultiSelect({ value, setValue, sourceData }) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
	});
	const handleValueSelect = (val) => {
        value.includes(val) ? setValue(value.filter((v) => v !== val)) : setValue([...value, val])
	};

	const handleValueRemove = (val) =>
        setValue(value.filter((v) => v !== val))
	const values = value.map((item) =>
		sourceData.map((source) => {
			if (source.source === item) {
				return (
					<SourceOptionPill
                    sourceText={item}
					key={item}
					value={item}
					onRemove={() => handleValueRemove(item)}
					>
					{item}
					</SourceOptionPill>
				);
			}
		})
	);
	const dot = (color = 'transparent') => ({
		'--dot-color': color,
	});

	const options = sourceData.map((item) => {
		return (
			<Combobox.Option
				value={item.source}
				key={item.source}
				active={value.includes(item.source)}
			>
				<Group gap="sm">
					{/* <Flex
					mih={20}
					mt={15}
					gap="md"
					justify="flex-start"
					align="flex-start"
					direction="row"
					wrap="wrap"
					> */}
					{/* {value.includes(item.value) ? <CheckIcon size={12} /> : null} */}
					{/* <Checkbox
						checked={value.includes(item.value)}
						onChange={() => {}}
						aria-hidden
						tabIndex={-1}
						style={{ pointerEvents: 'none' }}
					/> */}
					<span>{item.source}</span>
					{/* </Flex> */}
				</Group>
			</Combobox.Option>
		);
	});

	return (
		<Combobox
			store={combobox}
			onOptionSubmit={handleValueSelect}
			zIndex={9000}
			withinPortal={true}
			transitionProps={{ duration: 200, transition: 'pop' }}
		>
			<Combobox.DropdownTarget>
				<PillsInput
					pointer
					onClick={() => combobox.toggleDropdown()}
					label="Pick one or many sources"
				>
					<Pill.Group>
						{values.length > 0 ? (
							values
						) : (
							<Input.Placeholder>Pick one or more values</Input.Placeholder>
						)}

						<Combobox.EventsTarget>
							<PillsInput.Field
								type="hidden"
								onBlur={() => combobox.closeDropdown()}
								onKeyDown={(event) => {
									if (event.key === 'Backspace') {
										event.preventDefault();
										handleValueRemove(value[value.length - 1]);
									}
								}}
							/>
						</Combobox.EventsTarget>
					</Pill.Group>
				</PillsInput>
			</Combobox.DropdownTarget>

			<Combobox.Dropdown mah={200} style={{ overflowY: 'auto' }}>
				<Combobox.Options>{options}</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
