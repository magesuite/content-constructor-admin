<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\Component;

class ConfiguratorTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    const EXISTING_COMPONENT_TYPE_URL = '/backend/content-constructor/component/configurator/type/%s';

    public function testItDisplaysTemplateWhenConfiguratorIsInvoked() {
        $url = sprintf(self::EXISTING_COMPONENT_TYPE_URL, 'headline');

        $this->dispatch($url);

        $content = $this->getResponse()->getBody();

        $this->assertContains('<headline-configurator', $content);
    }
}
