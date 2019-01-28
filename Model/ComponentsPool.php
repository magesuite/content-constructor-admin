<?php

namespace MageSuite\ContentConstructorAdmin\Model;

class ComponentsPool extends \Magento\Framework\DataObject
{
    public function getComponentClass($type) {
        $components = $this->getComponents();

        if(isset($components[$type])) {
            return $components[$type]['className'];
        }

        return null;
    }
}