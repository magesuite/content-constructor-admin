<?php

namespace MageSuite\ContentConstructorAdmin\Plugin\Cms\Model\Block;

class AddContentConstructorOnBlockSave
{
    public function beforeSetData(\Magento\Cms\Model\Block $subject, $key, $value = null) {
        if(is_array($key) and isset($key['components'])) {
            $key['content_constructor_content'] = $key['components'];
        }

        return [$key, $value];
    }
}
