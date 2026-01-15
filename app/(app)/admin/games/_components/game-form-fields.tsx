"use client";

import type { Control, UseFormSetValue } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import type { CategoryDTO } from "@/lib/Dto/gameDTO";
import { CategorySelectorCombobox } from "./category-selector-combobox";

interface GameFormFieldsProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  imagePreview: string | null;
  currentImageUrl?: string | null;
}

export function GameFormFields({
  control,
  setValue,
  onImageChange,
  imagePreview,
  currentImageUrl,
}: GameFormFieldsProps) {
  const { data: categories = [] } = useQuery<CategoryDTO[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const displayImageUrl = imagePreview || currentImageUrl;

  return (
    <>
      {/* Image Upload Field */}
      <FormItem>
        <FormLabel>Capa do Jogo</FormLabel>
        <FormControl>
          <ImageUpload value={displayImageUrl} onChange={onImageChange} />
        </FormControl>
      </FormItem>

      {/* Name Field */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Jogo</FormLabel>
            <FormControl>
              <Input
                placeholder="The Last of Us Part II"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description Field */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Uma jornada épica..."
                className="resize-none min-h-[100px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category Selection Field */}
      <FormField
        control={control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <CategorySelectorCombobox
                categories={categories}
                selectedIds={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Published Status */}
      <FormField
        control={control}
        name="published"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">
                Status de Publicação
              </label>
              <p className="text-xs text-muted-foreground">
                Publicado ou em rascunho
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
        )}
      />
    </>
  );
}
