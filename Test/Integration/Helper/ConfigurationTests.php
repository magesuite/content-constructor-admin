<?php

namespace Creativestyle\MagesuiteContentConstructorAdmin\Helper;

class ConfigurationTests extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Helper\Configuration
     */
    protected $configuration;

    public function setUp()
    {
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $this->configuration = $objectManager->get(\MageSuite\ContentConstructorAdmin\Helper\Configuration::class);
    }

    /**
     * @magentoConfigFixture default/admin/url/custom_path testadmin
     */
    public function testItReturnsCorrectAdminPrefixFromDatabase()
    {
        $adminPath = $this->configuration->getAdminPath();
        $this->assertEquals('testadmin', $adminPath);
    }

    public function testItReturnsCorrectAdminPrefixFromAppEnv()
    {
        $adminPath = $this->configuration->getAdminPath();
        $this->assertEquals('backend', $adminPath);
    }
}
