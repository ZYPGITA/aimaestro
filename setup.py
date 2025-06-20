from setuptools import setup, find_packages

with open("README.rst", "r", encoding="utf-8") as f:
    long_description = f.read()

setup(
    name='aimaestro',
    version='1.1.8',
    description="aimaestro Description",
    long_description=long_description,
    include_package_data=True,
    author='YanPing',
    author_email='zyphhxx@foxmail.com',
    maintainer='YanPing',
    maintainer_email='zyphhxx@foxmail.com',
    license='MIT License',
    url='https://github.com/ZYPGITA/aimaestro',
    packages=find_packages(),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
    ],
    python_requires=">=3.8",
    install_requires=[
        'psutil',
        'pika',
        'pytz',
        'pymongo',
        'pyyaml',
        'selenium',
        'webdriver_manager',
        "pycryptodomex"
    ]
)
