<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml;

class Picker extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/picker.phtml';

    /**
     * @var \MageSuite\ContentConstructorAdmin\Model\ComponentsPool
     */
    protected $componentsPool;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\Model\ComponentsPool $componentsPool,
        array $data = []
    )
    {
        parent::__construct($context, $data);
        $this->componentsPool = $componentsPool;
    }

    public function getComponents() {
        $components = $this->componentsPool->getComponents();

        $result = [];

        foreach($components as $type => $component) {
            if(!isset($component['name']) or empty($component['name'])) {
                continue;
            }
            
            $result[] = [
                'type' => $type,
                'name' => $component['name'],
                'description' => $component['description']
            ];
        }

        return $result;
    }
}
