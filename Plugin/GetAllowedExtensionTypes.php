<?php
namespace MageSuite\ContentConstructorAdmin\Plugin;

class GetAllowedExtensionTypes
{
    public function afterGetAllowedExtensions(\Magento\Theme\Model\Design\Backend\Logo $subject, $result)
    {
        $result[] = 'svg';
        return $result;
    }
}
