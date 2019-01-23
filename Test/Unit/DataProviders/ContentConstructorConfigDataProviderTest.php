<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\DataProviders;

class ContentConstructorConfigDataProviderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $customizationPathStub;

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider
     */
    protected $configDataProvider;

    public function setUp()
    {
        $scopeConfigDummy = $this->getMockBuilder(\Magento\Framework\App\Config\ScopeConfigInterface::class)
            ->disableOriginalConstructor()
            ->getMock();

        $themeProviderStub = $this->getMockBuilder(\Magento\Framework\View\Design\Theme\ThemeProviderInterface::class)
            ->disableOriginalConstructor()
            ->getMock();


        $parentThemeStub = $this->getMockBuilder(\Magento\Framework\View\Design\ThemeInterface::class)
            ->disableOriginalConstructor()
            ->getMock();

        $themeStub = $this->getMockBuilder(\Magento\Framework\View\Design\ThemeInterface::class)
            ->disableOriginalConstructor()
            ->getMock();

        $themeStub->method('getParentTheme')->willReturn($parentThemeStub);

        $themeProviderStub->method('getThemeById')->willReturn($themeStub);

        $this->customizationPathStub = $this->getMockBuilder(\Magento\Framework\View\Design\Theme\Customization\Path::class)
            ->disableOriginalConstructor()
            ->getMock();

        $this->configDataProvider = new \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider(
            $scopeConfigDummy,
            $themeProviderStub,
            $this->customizationPathStub
        );
    }

    public function testItReturnsEmptyJsonObjectWhenThereAreNoConfigsDefined()
    {
        $this->assertEquals('{}', $this->configDataProvider->getConfig());
    }

    public function testItReturnsConfigFromParentTheme()
    {
        $this->customizationPathStub->method('getThemeFilesPath')->willReturnOnConsecutiveCalls(
            __DIR__ . '/../assets/theme-without-config',
            __DIR__ . '/../assets/parent-theme'
        );

        $this->assertEquals('{"test-data":"test-data-parent-theme"}', $this->configDataProvider->getConfig());
    }

    public function testItReturnsConfigFromDefaultTheme()
    {
        $this->customizationPathStub->method('getThemeFilesPath')->willReturnOnConsecutiveCalls(
            __DIR__ . '/../assets/theme',
            __DIR__ . '/../assets/parent-theme'
        );

        $this->assertEquals('{"test-data":"test-data"}', $this->configDataProvider->getConfig());
    }
}