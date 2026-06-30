import { supabase } from "@/lib/supabase"

export async function adicionarItemChecklist(
  projetoId: string,
  texto: string,
  pessoaId: string,
  ordem: number
) {
  const { error } = await supabase.from("checklist_items").insert({
    projeto_id: projetoId,
    texto,
    ordem,
    criado_por: pessoaId,
  })

  if (error) throw new Error(error.message)
}

export async function alternarItemChecklist(
  itemId: string,
  concluido: boolean
) {
  const { error } = await supabase
    .from("checklist_items")
    .update({ concluido })
    .eq("id", itemId)

  if (error) throw new Error(error.message)
}

export async function editarTextoItemChecklist(
  itemId: string,
  texto: string
) {
  const { error } = await supabase
    .from("checklist_items")
    .update({ texto })
    .eq("id", itemId)

  if (error) throw new Error(error.message)
}

export async function excluirItemChecklist(itemId: string) {
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", itemId)

  if (error) throw new Error(error.message)
}
