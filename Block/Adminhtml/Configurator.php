<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml;

class Configurator extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \MageSuite\ContentConstructor\ComponentManager
     */
    private $componentManager;

    /**
     * Constructor constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration
     * @param \Magento\Framework\App\DeploymentConfig\Reader $configReader
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructor\ComponentManager $componentManager,
        array $data = []
    )
    {
        $this->componentManager = $componentManager;

        parent::__construct($context, $data);
    }

    public function toHtml() {

        $type = $this->getRequest()->getParam('type');

        if($type == 'button') {
            $contents = $this->getLayout()->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Button::class)
                ->toHtml();
        }
        else if($type == 'headline') {
            $contents = $this->getLayout()->createBlock(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Headline::class)
                ->toHtml();
        }
        else {
            $contents = $this->componentManager
                ->initializeComponent($type)
                ->renderConfigurator();
        }

        return $contents;
    }
}