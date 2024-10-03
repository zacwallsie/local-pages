import React, { useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Service, ServiceCategory, ServiceCategoryInternalName } from "@/types/supabase"
import { ArrowUpDown, EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { EditServiceDialog } from "./EditServiceDialog"

type ColumnsProps = {
	onServiceUpdated: (updatedService: Partial<Service>) => Promise<void>
	onServiceDeleted: (serviceId: string) => Promise<void>
}

export const createColumns = ({ onServiceUpdated, onServiceDeleted }: ColumnsProps): ColumnDef<Service>[] => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" className="font-bold m-0 p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Service Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("description")}</div>,
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			const category = row.getValue("category") as ServiceCategoryInternalName
			const IconComponent = ServiceCategory[category].displayIcon
			return (
				<div className="flex items-center">
					{IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
					<span>{ServiceCategory[category].displayName}</span>
				</div>
			)
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const service = row.original
			const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
			const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

			const handleDelete = async () => {
				await onServiceDeleted(service.id)
				setIsDeleteDialogOpen(false)
			}

			// This is a hack to ensure pointer-events are reset when dialog is closed
			// Problem with Dialog component not resetting pointer-events in Menus (bug in shadcn)
			useEffect(() => {
				document.body.style.pointerEvents = "auto"
			}, [isDeleteDialogOpen, isEditDialogOpen])

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<EllipsisVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit service
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete service
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<EditServiceDialog
						service={service}
						onServiceUpdated={onServiceUpdated}
						open={isEditDialogOpen}
						onOpenChange={setIsEditDialogOpen}
					/>

					<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the service "{service.name}" and remove it from our
									servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)
		},
	},
]
