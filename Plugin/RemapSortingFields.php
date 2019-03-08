<?php

namespace MageSuite\ContentConstructorAdmin\Plugin;

/**
 * This class remaps sorting fields in components from old structure to new one
 * Class RemapSortingFields
 */
class RemapSortingFields
{
    protected $oldToNewSortValuesMapping = [
        'creation_date' => 'created_at',
        'bestsellers_amount' => 'bestseller_score_by_amount'
    ];

    public function afterGetExistingComponentsConfiguration(
        \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Constructor $subject,
        $result
    )
    {
        $components = json_decode($result, true);

        if(empty($components)) {
            return $result;
        }

        foreach ($components as &$component) {
            if (!isset($component['data']['order_by']) or empty($component['data']['order_by'])) {
                continue;
            }

            if ($component['data']['order_by'] == 'newest_products') {
                $component['data']['order_by'] = '';
                $component['data']['filter'] = 'new_products';
            }

            if(isset($this->oldToNewSortValuesMapping[$component['data']['order_by']])) {
                $component['data']['order_by'] = $this->oldToNewSortValuesMapping[$component['data']['order_by']];
            }
        }

        return json_encode($components);
    }
}