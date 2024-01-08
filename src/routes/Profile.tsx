import CustomButton from "@/components/atoms/Button";
import InputField from "@/components/atoms/InputField";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { SubscriptionCard } from "@/components/molecules/SubscriptionCard";
import { config } from "@/config";
import { useGetUserProfileQuery } from "@/services/spotify/user/user.endpoint";
import {
	useLazySignOutQuery,
	useUpdatePasswordMutation,
} from "@/services/supabase/auth/auth.endpoints";
import { passwordSchema } from "@/services/supabase/auth/auth.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertTriangle,
	ChevronRight,
	DollarSign,
	LockKeyhole,
	UserCog,
	XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import * as Burnt from "burnt";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Avatar,
	Button,
	H4,
	H6,
	ListItem,
	Paragraph,
	XStack,
	YGroup,
	YStack,
} from "tamagui";
import { z } from "zod";

type ModalComponent = "account" | "subscription" | undefined;

function Profile() {
	const { data } = useGetUserProfileQuery(undefined);
	const [signOut] = useLazySignOutQuery();
	const [modal, setModal] = useState<ModalComponent>(undefined);

	function handleCloseModal() {
		setModal(undefined);
	}

	return (
		<>
			<YStack
				fullscreen
				bg="$primary700"
				px={16}
				pt={84}
				pb={24}
				justifyContent="space-between"
			>
				<YStack gap={16}>
					<YStack>
						<H6
							pl={16}
							pb={4}
							width="100%"
							color="$lightText"
							textTransform="uppercase"
						>
							spotify account
						</H6>
						<ListItem
							title={data?.display_name}
							subTitle={data?.email}
							icon={
								<Avatar
									circular
									size="$4"
									borderWidth={1}
									borderColor="$primary400"
									bg="$primary400"
									elevate
								>
									<Avatar.Image src={data?.images[1]?.url} />
									<Avatar.Fallback bc="$brand" />
								</Avatar>
							}
							radiused
						/>
					</YStack>

					<YStack>
						<H6
							pl={16}
							pb={4}
							width="100%"
							color="$lightText"
							textTransform="uppercase"
						>
							fuse account
						</H6>
						<YGroup width="100%" mb={8}>
							<ListItem
								title="Fuse"
								subTitle="Edit your account"
								icon={<UserCog size={24} />}
								iconAfter={<ChevronRight size={18} />}
								pressStyle={{ bg: "$primary300" }}
								onPress={() => setModal("account")}
							/>

							<ListItem
								title="Subscription"
								subTitle="Change your subscription plan"
								icon={<DollarSign size={24} />}
								iconAfter={<ChevronRight size={18} />}
								pressStyle={{ bg: "$primary300" }}
								onPress={() => setModal("subscription")}
							/>
						</YGroup>
					</YStack>
				</YStack>

				<YStack gap={16}>
					<Paragraph
						textAlign="center"
						color="$lightText"
					>{`Version ${config.meta.appVersion}`}</Paragraph>
					<ConfirmDialog
						title="Sign out"
						description="Are you sure?"
						action={() => signOut()}
						renderTrigger={() => <Button width="100%">Sign Out</Button>}
					/>
				</YStack>
			</YStack>

			<Sheet
				modal
				moveOnKeyboardChange
				open={modal !== undefined}
				animation="quick"
				snapPointsMode="fit"
			>
				<Sheet.Overlay
					onPress={handleCloseModal}
					animation="quick"
					enterStyle={{ opacity: 0.5 }}
					exitStyle={{ opacity: 0 }}
				/>
				<Sheet.Frame padding={20} borderRadius={28} pb={48}>
					{modal === "account" && (
						<AccountModal title="Fuse Account" onClose={handleCloseModal} />
					)}
					{modal === "subscription" && (
						<SubscriptionModal
							title="Subscription"
							onClose={handleCloseModal}
						/>
					)}
				</Sheet.Frame>
			</Sheet>
		</>
	);
}

interface ModalProps {
	onClose(): void;
	title: string;
}

type AccountOption = "passwordChange" | "deleteAccount" | undefined;

function AccountModal({ onClose, title }: ModalProps) {
	const [optionSelected, setOptionSelected] =
		useState<AccountOption>(undefined);

	return (
		<YStack gap={16}>
			<XStack justifyContent="space-between" alignItems="center">
				{optionSelected === undefined ? (
					<H4>{title}</H4>
				) : (
					<H4>Change Password</H4>
				)}
				<XCircle onPress={onClose} />
			</XStack>
			{optionSelected === undefined && (
				<YStack gap={16}>
					<Button
						justifyContent="flex-start"
						icon={LockKeyhole}
						onPress={() => setOptionSelected("passwordChange")}
					>
						Change Password
					</Button>

					<Button
						justifyContent="flex-start"
						bg="$error400"
						color="$error700"
						borderColor="$error700"
						borderWidth={0.5}
						icon={AlertTriangle}
						onPress={() => setOptionSelected("deleteAccount")}
					>
						Delete Account
					</Button>
				</YStack>
			)}
			{optionSelected === "passwordChange" && (
				<PasswordChangeForm onClose={onClose} />
			)}
			{optionSelected === "deleteAccount" && <DeleteAccountForm />}
		</YStack>
	);
}

function DeleteAccountForm() {
	const { control, handleSubmit } = useForm<{ password: string }>({
		defaultValues: {
			password: "",
		},
	});

	function onSubmit(data: { password: string }) {
		console.log(data);
	}

	return (
		<YStack gap={16}>
			<Paragraph color="$lightText">
				Deleting your account is irreverseble.
			</Paragraph>
			<InputField
				label="Confirm Password"
				secureTextEntry
				type="password"
				placeholder="********"
				controlProps={{ control, name: "password" }}
			/>
			<Button
				justifyContent="flex-start"
				bg="$error400"
				color="$error700"
				borderColor="$error700"
				borderWidth={0.5}
				icon={AlertTriangle}
				onPress={handleSubmit(onSubmit)}
			>
				Confirm
			</Button>
		</YStack>
	);
}

const passwordChangeSchema = z
	.object({
		currentPassword: passwordSchema,
		newPassword: passwordSchema,
		confirmNewPassword: passwordSchema,
	})
	.refine((schema) => schema.newPassword === schema.confirmNewPassword, {
		path: ["confirmNewPassword"],
		message: "Passwords don't match",
	});

type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
	onClose(): void;
}

function PasswordChangeForm({ onClose }: PasswordChangeFormProps) {
	const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
	const { control, handleSubmit, setError, reset } =
		useForm<PasswordChangeInput>({
			defaultValues: {
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: "",
			},
			resolver: zodResolver(passwordChangeSchema),
		});

	async function onSubmit(data: PasswordChangeInput) {
		const result = await updatePassword({
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
		});

		if ("error" in result) {
			setError("currentPassword", {
				message: result.error.message ?? "Something went wrong",
			});
		}

		if ("data" in result) {
			reset();
			onClose();

			Burnt.toast({
				title: "Password changed!",
				preset: "done",
			});
		}
	}

	return (
		<YStack>
			<YStack gap={16}>
				<InputField
					controlProps={{ control, name: "currentPassword" }}
					label="Current Password"
					secureTextEntry
					type="password"
					placeholder="********"
				/>
				<InputField
					controlProps={{ control, name: "newPassword" }}
					label="New Password"
					secureTextEntry
					placeholder="********"
				/>
				<InputField
					controlProps={{ control, name: "confirmNewPassword" }}
					label="Confirm Password"
					secureTextEntry
					placeholder="********"
				/>
			</YStack>

			<CustomButton
				label="Submit"
				marginTop={16}
				onPress={handleSubmit(onSubmit)}
				isLoading={isLoading}
				isDisabled={isLoading}
			/>
		</YStack>
	);
}

function SubscriptionModal({ onClose, title }: ModalProps) {
	return (
		<YStack gap={16}>
			<XStack justifyContent="space-between" alignItems="center">
				<H4>{title}</H4>
				<XCircle onPress={onClose} />
			</XStack>
			<SubscriptionCard
				onPress={() => {}}
				active
				title="test"
				body="d"
				price={1}
			/>
		</YStack>
	);
}

export default Profile;
