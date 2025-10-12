<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TypeEventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'en_title'  => $this->en_title,
            'ar_title'  => $this->ar_title,
            'coding'    => $this->coding,
            'icon_path' => $this->icon_path,
            // 'flags'     => [
            //     'show_map'                  => (int) $this->show_map,
            //     'display_registration_form' => (int) $this->display_registration_form,
            //     'show_app'                  => (int) $this->show_app,
            //     'state'                     => (int) $this->state,
            // ],
            'children'  => TypeEventResource::collection($this->whenLoaded('childrenRecursive')),
        ];
    }
}
